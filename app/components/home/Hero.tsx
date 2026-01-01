/* eslint-disable react/jsx-no-comment-textnodes */
import { ScanSearch } from 'lucide-react';

export default function Hero() {
	return (
		<div className="text-center max-w-4xl mx-auto relative z-10 px-4">
			{/* Label Kategori */}
			<div className="inline-flex items-center gap-2 border border-primary/50 px-3 py-1 mb-6 rotate-[-2deg] bg-surface/50 backdrop-blur-sm">
				<ScanSearch
					size={16}
					className="text-accent"
				/>
				<span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
					AI Diagnostic Tool
				</span>
			</div>

			{/* Judul Utama */}
			<h2 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl text-primary tracking-tighter mb-6 leading-[0.9]">
				Tomato Leaf <br />
				<span className="text-accent italic font-sans relative inline-block">
					Disease Detection
					{/* Garis bawah coretan */}
					<svg
						className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-60"
						viewBox="0 0 100 10"
						preserveAspectRatio="none"
					>
						<path
							d="M0 5 Q 50 10 100 5"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
						/>
					</svg>
				</span>
			</h2>

			{/* Sub-judul: Deskripsi Teknis yang Benar */}
			<p className="font-mono text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed border-l-4 border-accent pl-4 text-left sm:text-center sm:border-l-0 sm:pl-0">
				// Sistem diagnosis dini penyakit tanaman tomat berbasis{' '}
				<span className="font-bold text-primary">YOLOv11 (You Only Look Once)</span>.
				<br className="hidden sm:block" />
				Akurasi tinggi untuk klasifikasi dan lokalisasi hama.
			</p>
		</div>
	);
}
