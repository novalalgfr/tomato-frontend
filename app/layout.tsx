import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-space',
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
	weight: ['400', '700'],
	display: 'swap'
});

export const metadata: Metadata = {
	title: {
		template: '%s | TomatoDoctor',
		default: 'TomatoDoctor - YOLOv11 AI Diagnostic'
	},
	description: 'Sistem deteksi penyakit daun tomat berbasis Artificial Intelligence (YOLOv11).',
	keywords: ['YOLOv11', 'Computer Vision', 'Tomato Disease', 'Skripsi', 'AI'],
	authors: [{ name: 'Ahmad Noval Algifari' }]
};

export const viewport: Viewport = {
	themeColor: '#0a0a0a'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="id"
			className="dark"
		>
			<body
				className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen relative overflow-x-hidden bg-background text-primary selection:bg-accent selection:text-white`}
			>
				<div className="fixed inset-0 pointer-events-none z-50 shadow-[inset_0_0_150px_rgba(0,0,0,0.7)]" />

				<main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
					<div className="w-full bg-surface border border-border/60 p-6 sm:p-10 paper-shadow relative rounded-sm mt-8 mb-8">
						<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 tape-effect z-10 rotate-[10deg]" />
						{children}
					</div>

					<footer className="mb-8 text-center font-mono text-[10px] sm:text-xs text-secondary/40 uppercase tracking-widest">
						<p>System_Version: v1.0.0 // Model: YOLOv11-Nano</p>
						<p className="mt-2">© 2026 Lab. Intelligence. Ahmad Noval Algifari.</p>
					</footer>
				</main>
			</body>
		</html>
	);
}
