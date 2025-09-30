'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '../better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Watchlist } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";
import { getStocksDetails } from "@/lib/actions/finnhub.actions";

// Add stock to watchlist
export const addToWatchlist = async (symbol: string, company: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        await connectToDatabase(); // ✅ ensure DB connection

        // Check if stock already exists in watchlist
        const existingItem = await Watchlist.findOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
        });

        if (existingItem) {
            return { success: false, error: 'Stock already in watchlist' };
        }

        // Add to watchlist
        const newItem = new Watchlist({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
            company: company.trim(),
        });

        await newItem.save();
        revalidatePath('/watchlist');

        return { success: true, message: 'Stock added to watchlist' };
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw new Error('Failed to add stock to watchlist');
    }
};

// Remove stock from watchlist
export const removeFromWatchlist = async (symbol: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        await connectToDatabase(); // ✅ ensure DB connection

        // Remove from watchlist
        await Watchlist.deleteOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
        });
        revalidatePath('/watchlist');

        return { success: true, message: 'Stock removed from watchlist' };
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        throw new Error('Failed to remove stock from watchlist');
    }
};

// Get user's watchlist
export const getUserWatchlist = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        await connectToDatabase(); // ✅ ensure DB connection

        const watchlist = await Watchlist.find({ userId: session.user.id })
            .sort({ addedAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(watchlist));
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        throw new Error('Failed to fetch watchlist');
    }
};

// Get watchlist symbols by user email (used by background jobs)
export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
    try {
        if (!email) return [];

        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('Mongoose connection not connected');

        // Find user by email in the "user" collection
        const user = await db.collection('user').findOne(
            { email: { $eq: email } },
            { projection: { _id: 1, id: 1, email: 1 } }
        );

        if (!user) return [];
        const userId = (user as any).id || (user as any)._id?.toString() || '';
        if (!userId) return [];

        // Fetch watchlist symbols for that user
        const items = await Watchlist.find({ userId }).select('symbol').lean();
        const symbols = (items || [])
            .map((it: any) => String(it?.symbol || '').trim().toUpperCase())
            .filter(Boolean);

        // Return unique, uppercased symbols
        return Array.from(new Set(symbols));
    } catch (error) {
        console.error('Error fetching watchlist symbols by email:', error);
        return [];
    }
};

// Get user's watchlist with stock data
export const getWatchlistWithData = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        await connectToDatabase(); // ✅ ensure DB connection

        const watchlist = await Watchlist.find({ userId: session.user.id }).sort({ addedAt: -1 }).lean();

        if (watchlist.length === 0) return [];

        const stocksWithData = await Promise.all(
            watchlist.map(async (item) => {
                const stockData = await getStocksDetails(item.symbol);

                if (!stockData) {
                    console.warn(`Failed to fetch data for ${item.symbol}`);
                    return item;
                }

                return {
                    company: stockData.company,
                    symbol: stockData.symbol,
                    currentPrice: stockData.currentPrice,
                    priceFormatted: stockData.priceFormatted,
                    changeFormatted: stockData.changeFormatted,
                    changePercent: stockData.changePercent,
                    marketCap: stockData.marketCapFormatted,
                    peRatio: stockData.peRatio,
                };
            }),
        );

        return JSON.parse(JSON.stringify(stocksWithData));
    } catch (error) {
        console.error('Error loading watchlist:', error);
        throw new Error('Failed to fetch watchlist');
    }
};
