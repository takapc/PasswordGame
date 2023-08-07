import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "The Password Game",
    description: "Created by @takap_c",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body className={inter.className}>
                <Providers>{children}</Providers>
                <Analytics />
            </body>
        </html>
    );
}
