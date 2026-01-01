import { Github, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
	return (
		// Menggunakan border-dashed untuk efek kertas sobek/perforasi
		<nav className="w-full flex flex-col sm:flex-row justify-between items-center py-6 border-b-2 border-dashed border-border/30 gap-4">
			{/* Logo Area */}
			<div className="flex items-center gap-3 group cursor-default">
				<div className="relative">
					<div className="absolute inset-0 bg-leaf/20 rounded-full blur-sm transform group-hover:scale-125 transition-transform" />
					<Leaf
						className="relative text-leaf w-8 h-8 transform -rotate-12"
						strokeWidth={2.5}
					/>
				</div>

				<h1 className="text-3xl font-sans font-black tracking-tighter text-primary">
					Tomato<span className="text-accent italic font-sans">.Logy</span>
				</h1>
			</div>

			{/* Navigation / Actions */}
			<div className="flex items-center gap-4">
				{/* Link GitHub dibuat seperti Tag/Label */}
				<Link
					href="https://github.com/novalalgfr"
					className="
                        relative font-mono text-sm font-bold text-primary 
                        px-4 py-2 bg-surface border-2 border-border 
                        shadow-[2px_2px_0px_var(--color-border)] 
                        hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none 
                        transition-all flex items-center gap-2
                        hover:bg-accent hover:text-white hover:border-accent
                    "
				>
					<Github size={16} />
					<span>SOURCE_CODE</span>
				</Link>
			</div>
		</nav>
	);
}
