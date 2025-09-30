import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { getFormattedTodayDate } from "../utils";

export const sendSignUpEmail = inngest.createFunction(
    {id: 'sign-up-email'},
    {event: 'app/user.created'},
    async ({ event, step}) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment Goals: ${event.data.investmentGoals}
            - Risk Tolerance: ${event.data.riskTolerance}
            - Preferred Industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({model: 'gemini-2.5-flash-lite'}),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {text: prompt}
                        ]
                    }
                ]
            }
        })

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0]
            const introText = (part && 'text' in part ? part.text : null) || 'Thanks for joining Signalist. You have the tools to track markets and make moves.'

            const {data: {email, name}} = event;
            return await sendWelcomeEmail({
                email, name, intro: introText
            });
        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
    {id: 'daily-news-summary'},
    [{event: 'app/send/daily.news'}, {cron: '12 0 * * *'}],
    async ({step}) => {
        // Get all users for news delivery
        const users = await step.run('get-all-users', getAllUsersForNewsEmail);

        if(!users || users.length === 0)
            return {success: false, message: 'No users found for news email'};

        // Fetch personalized news for each user
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    // Enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    // If still empty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] });
                }
            }
            return perUser;
        });

        // Sumarize these news via AI for each user
        const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

        for (const { user, articles } of results as Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }>) {
                try {
                    if (!articles || articles.length === 0) {
                        userNewsSummaries.push({ user, newsContent: null });
                        continue;
                    }

                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

                    const response = await step.ai.infer(`summarize-news-${user.email}`, {
                        model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                        body: {
                            contents: [{ role: 'user', parts: [{ text:prompt }]}]
                        }
                    });

                    const part = response.candidates?.[0]?.content?.parts?.[0];
                    const newsContent = (part && 'text' in part ? part.text : null) || null;

                    userNewsSummaries.push({ user, newsContent });
                } catch (e) {
                    console.error('Failed to summarize news for : ', user.email);
                    userNewsSummaries.push({ user, newsContent: null });
                }
            }

        // Send emails
        await step.run('send-news-emails', async () => {
                const sendResults = await Promise.allSettled(
                    userNewsSummaries.map(async ({ user, newsContent }) => {
                        if (!newsContent) return false;
                        await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent });
                        return true;
                    })
                );
                sendResults.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.error(
                            'daily-news: failed to send email',
                            userNewsSummaries[index].user.email,
                            result.reason
                        );
                    }
                });
            })

        return { success: true, message: 'Daily news summary emails sent successfully' }
    }
)