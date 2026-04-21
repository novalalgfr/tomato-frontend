/* eslint-disable react/jsx-no-comment-textnodes */
'use client';

import { Activity, AlertTriangle, Bug, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { DetectionDetail } from './InputArea';

interface DetectionResultsProps {
	details: DetectionDetail[];
}

export default function DetectionResults({ details }: DetectionResultsProps) {
	if (!details || details.length === 0) return null;

	const groupedDetails = details.reduce(
		(acc, curr) => {
			const name = curr.class_name;
			if (!acc[name]) {
				acc[name] = {
					name: name,
					count: 1,
					maxConfidence: curr.confidence,
					minConfidence: curr.confidence
				};
			} else {
				acc[name].count += 1;
				acc[name].maxConfidence = Math.max(acc[name].maxConfidence, curr.confidence);
				acc[name].minConfidence = Math.min(acc[name].minConfidence, curr.confidence);
			}
			return acc;
		},
		{} as Record<string, { name: string; count: number; maxConfidence: number; minConfidence: number }>
	);

	const summaryList = Object.values(groupedDetails);

	const isTotallyHealthy = summaryList.every((d) => d.name.toLowerCase().includes('healthy'));

	return (
		<div className="w-full mt-6 bg-surface paper-shadow p-4 sm:p-6 relative z-10">
			<div className="absolute -top-5 -left-2 sm:-left-4 inline-flex items-center gap-2 px-3 py-1.5 z-20 tape-effect text-primary">
				<Activity
					size={16}
					className="text-accent"
				/>
				<span className="font-mono text-xs font-black uppercase tracking-widest">Diagnosis_Report</span>
			</div>

			<div className="mt-4 mb-6">
				<p className="font-mono text-secondary text-sm border-l-4 border-accent pl-3">
					// Scan completed. Found <span className="font-bold text-primary">{details.length}</span> region(s)
					across <span className="font-bold text-primary">{summaryList.length}</span> class(es).
				</p>
			</div>

			<div className="flex flex-col gap-4">
				{summaryList.map((item, index) => {
					const cleanName = item.name.replace(/_/g, ' ').toUpperCase();
					const isItemHealthy = cleanName.includes('HEALTHY');

					return (
						<div
							key={index}
							className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-border bg-[#111] hover:bg-white/5 transition-all gap-4 shadow-[4px_4px_0px_#000]"
						>
							<div className="flex items-center gap-4">
								<div
									className={clsx(
										'p-3 border-2 border-border shadow-[2px_2px_0px_#000]',
										isItemHealthy ? 'bg-leaf text-black' : 'bg-accent text-white'
									)}
								>
									{isItemHealthy ? <CheckCircle2 size={24} /> : <Bug size={24} />}
								</div>
								<div>
									<h4 className="font-mono font-black text-lg text-primary tracking-tight">
										{cleanName}
									</h4>
									<p className="font-mono text-xs text-secondary uppercase tracking-widest mt-1">
										{item.count} Region{item.count > 1 ? 's' : ''} Detected
									</p>
								</div>
							</div>

							<div className="flex flex-col items-center bg-surface border-2 border-border px-4 py-2 shadow-inner">
								<span className="font-mono text-[10px] font-bold text-secondary uppercase tracking-wider mb-0.5">
									AI_ACCURACY
								</span>
								<span
									className={clsx(
										'font-sans font-black tracking-tighter leading-none',
										Math.round(item.minConfidence) === Math.round(item.maxConfidence)
											? 'text-2xl'
											: 'text-xl',
										item.maxConfidence >= 85 ? 'text-leaf' : 'text-[#eab308]'
									)}
								>
									{Math.round(item.minConfidence) === Math.round(item.maxConfidence)
										? `${Math.round(item.maxConfidence)}%`
										: `${Math.round(item.minConfidence)}% - ${Math.round(item.maxConfidence)}%`}
								</span>
							</div>
						</div>
					);
				})}
			</div>

			{!isTotallyHealthy && (
				<div className="mt-8 flex items-start gap-3 p-4 border-2 border-dashed border-accent bg-accent/10">
					<AlertTriangle
						size={20}
						className="text-accent shrink-0 mt-0.5"
					/>
					<p className="font-mono text-xs sm:text-sm text-primary leading-relaxed">
						<span className="font-bold text-accent">ATTENTION:</span> Pathogens detected. Isolate affected
						plants immediately to prevent spread. Refer to the standard mitigation guide for the identified
						classification.
					</p>
				</div>
			)}
		</div>
	);
}
