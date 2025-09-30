import TradingViewWidget from "@/components/TradingViewWidget";
import {
    BASELINE_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    SYMBOL_INFO_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/contants";
import WatchlistButton from "@/components/WatchlistButton";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

const StockDetails = async ({ params }: StockDetailsPageProps) => {
    const { symbol } = await params;

    // ✅ Check DB for current user's watchlist
    const session = await auth.api.getSession({ headers: await headers() });
    let isInWatchlist = false;

    if (session?.user) {
        await connectToDatabase();
        const existing = await Watchlist.findOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
        });
        isInWatchlist = !!existing;
    }

    const scriptBase = "https://s3.tradingview.com/external-embedding/embed-widget-";

    return (
        <div className="flex min-h-screen w-full">
            <section className="grid w-full gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Left column */}
                <div className="space-y-6">
                    <TradingViewWidget
                        scriptUrl={`${scriptBase}symbol-info.js`}
                        config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                        height={170}
                    />
                    <TradingViewWidget
                        scriptUrl={`${scriptBase}advanced-chart.js`}
                        config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                        className="custom-chart"
                        height={600}
                    />
                    <TradingViewWidget
                        scriptUrl={`${scriptBase}advanced-chart.js`}
                        config={BASELINE_WIDGET_CONFIG(symbol)}
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* ✅ Now button reflects true DB state */}
                    <WatchlistButton
                        symbol={symbol}
                        company={symbol}
                        isInWatchlist={isInWatchlist}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptBase}technical-analysis.js`}
                        config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                        height={400}
                    />
                    <TradingViewWidget
                        scriptUrl={`${scriptBase}symbol-profile.js`}
                        config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                        height={440}
                    />
                    <TradingViewWidget
                        scriptUrl={`${scriptBase}fundamental-data.js`}
                        config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                        height={464}
                    />
                </div>
            </section>
        </div>
    );
};

export default StockDetails;
