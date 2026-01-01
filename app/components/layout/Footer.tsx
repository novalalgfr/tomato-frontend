export default function Footer() {
	return (
		<footer className="w-full mt-auto pt-8 pb-4 text-center">
			<div className="w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent mb-6" />

			<div className="font-mono text-xs text-secondary space-y-2">
				<p>
					<span className="font-bold border-b border-secondary/30 pb-0.5">PROJECT: 2026</span>
					&nbsp;—&nbsp; DEPT. INFORMATICS
				</p>

				<p>
					Powered by <span className="text-accent font-bold">YOLOv11</span> &{' '}
					<span className="text-primary font-bold">Next.js</span>.
					<br />
					Training Data: <span className="italic">Kaggle Tomato Leaf Disease Dataset</span>.
				</p>

				<p className="opacity-60 pt-4 font-mono italic text-sm">
					&copy; {new Date().getFullYear()} Ahmad Noval Algifari.
				</p>
			</div>
		</footer>
	);
}
