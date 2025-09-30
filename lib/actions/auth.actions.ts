'use server';

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

export const signUpWithEmail = async (formData: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email: formData.email,
                password: formData.password,
                name: formData.fullName
            }
        });

        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: { ...formData }
            });
        }

        // Return only serializable fields
        return {
            success: true,
            user: {
                email: formData.email,
                name: formData.fullName
            }
        };
    } catch (error) {
        console.error('Sign up failed:', error);
        return { success: false, error: 'Sign Up Failed' };
    }
};

export const signOut = async () => {
    try {
        await auth.api.signOut({headers: await headers()});
    } catch (error) {
        return {success: false, error: 'Sign out failed'}
    }
}

export const signInWithEmail = async ({email, password}: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({
            body: {
                email: email,
                password: password,
            }
        })

        return {success: true, data: response}

    } catch (error) {
        console.log('Sign in failed, ', error);
        return {success: false, error: 'Sign In Failed'}
    }
}