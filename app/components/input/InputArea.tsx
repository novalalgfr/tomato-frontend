'use client';

import { useState, useCallback, useRef } from 'react';
import { Camera, Upload, RefreshCw, X, Eye, Scan, ImagePlus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Image from 'next/image';

type InputMode = 'file' | 'camera';
type ViewMode = 'original' | 'detected';

const dataURLtoFile = (dataurl: string, filename: string) => {
	const arr = dataurl.split(',');
	const match = arr[0].match(/:(.*?);/);
	const mime = match ? match[1] : 'image/jpeg';
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
};

export default function InputArea() {
	const [mode, setMode] = useState<InputMode>('file');
	const [image, setImage] = useState<string | null>(null);
	const [fileToUpload, setFileToUpload] = useState<File | null>(null);

	const [detectedImage, setDetectedImage] = useState<string | null>(null);

	const [isProcessing, setIsProcessing] = useState(false);
	const [result, setResult] = useState<boolean>(false);
	const [activeView, setActiveView] = useState<ViewMode>('original');
	const [notification, setNotification] = useState<string | null>(null);

	const webcamRef = useRef<Webcam>(null);

	const showNotification = (message: string) => {
		setNotification(message);
		setTimeout(() => setNotification(null), 4000);
	};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			setImage(URL.createObjectURL(file));
			setFileToUpload(file);
			setNotification(null);
			setResult(false);
			setActiveView('original');
			setDetectedImage(null);
		}
	}, []);

	const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
		const file = fileRejections[0];
		const error = file.errors[0];
		if (error.code === 'file-too-large') {
			showNotification('File too large! Maximum 5MB.');
		} else if (error.code === 'file-invalid-type') {
			showNotification('Invalid format! Use JPG or PNG.');
		} else {
			showNotification(error.message);
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		onDropRejected,
		accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
		maxSize: 5 * 1024 * 1024,
		multiple: false
	});

	const capture = useCallback(() => {
		const imageSrc = webcamRef.current?.getScreenshot();
		if (imageSrc) {
			setImage(imageSrc);
			const file = dataURLtoFile(imageSrc, 'camera-capture.jpg');
			setFileToUpload(file);
			setNotification(null);
			setResult(false);
			setDetectedImage(null);
			setActiveView('original');
		}
	}, [webcamRef]);

	const handleGenerate = async () => {
		if (!fileToUpload) {
			showNotification('Error: Please insert leaf sample first!');
			return;
		}
		setIsProcessing(true);
		setActiveView('original');
		setResult(false);

		const formData = new FormData();
		formData.append('file', fileToUpload);

		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

		try {
			const response = await fetch(`${baseUrl}/predict`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();

			if (response.ok && data.status === 'success') {
				setDetectedImage(data.detect_url);
				setResult(true);
				setActiveView('detected');
			} else {
				showNotification(data.error || 'Failed to process image.');
			}
		} catch (error) {
			console.error(error);
			showNotification('Server Error: Backend not responding.');
		} finally {
			setIsProcessing(false);
		}
	};

	const handleReset = () => {
		setImage(null);
		setFileToUpload(null);
		setResult(false);
		setDetectedImage(null);
		setActiveView('original');
		setNotification(null);
	};

	return (
		<div className="relative w-full max-w-3xl mx-auto">
			<div className="flex pl-4 gap-2">
				<button
					onClick={() => {
						setMode('file');
						handleReset();
					}}
					className={clsx(
						'px-6 py-3 text-sm font-bold font-mono uppercase tracking-wider border-2 border-b-0 border-border rounded-t-lg transition-all cursor-pointer',
						mode === 'file'
							? 'bg-surface text-accent border-b-surface -mb-[2px] z-10'
							: 'bg-white/5 text-secondary hover:bg-white/10 hover:text-primary'
					)}
				>
					<div className="flex items-center gap-2">
						<Upload size={16} /> File_Upload
					</div>
				</button>
				<button
					onClick={() => {
						setMode('camera');
						handleReset();
					}}
					className={clsx(
						'px-6 py-3 text-sm font-bold font-mono uppercase tracking-wider border-2 border-b-0 border-border rounded-t-lg transition-all cursor-pointer',
						mode === 'camera'
							? 'bg-surface text-accent border-b-surface -mb-[2px] z-10'
							: 'bg-white/5 text-secondary hover:bg-white/10 hover:text-primary'
					)}
				>
					<div className="flex items-center gap-2">
						<Camera size={16} /> Live_Cam
					</div>
				</button>
			</div>

			<div className="bg-surface border-2 border-border p-6 sm:p-8 paper-shadow min-h-[450px] relative z-0">
				<div className="absolute -top-5 -right-1 sm:right-4 bg-[#27272a] border-2 border-[#525252] px-4 py-1 shadow-lg z-20 flex items-center gap-3 rounded-sm">
					<div className="w-1.5 h-1.5 rounded-full bg-[#737373] shadow-inner" />

					<span className="font-mono text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
						INPUT_ZONE
					</span>

					<div className="w-1.5 h-1.5 rounded-full bg-[#737373] shadow-inner" />
				</div>

				{!image ? (
					mode === 'file' ? (
						<div
							{...getRootProps()}
							className={clsx(
								'w-full h-[350px] border-4 border-dashed border-border/40 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all bg-white/5',
								isDragActive
									? 'border-accent bg-accent/10 scale-[0.99]'
									: 'hover:border-accent hover:bg-white/10'
							)}
						>
							<input {...getInputProps()} />
							<div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-border">
								<ImagePlus
									size={40}
									className="text-secondary"
								/>
							</div>
							<h3 className="font-mono text-2xl font-bold text-primary mb-2">Insert Sample Here</h3>
							<p className="font-mono text-sm text-secondary">Drag & Drop or Click to Browse</p>
							<p className="font-mono text-xs text-secondary/50 mt-2">Supports JPG, PNG (Max 5MB)</p>
						</div>
					) : (
						<div className="w-full h-[350px] bg-black rounded-lg overflow-hidden relative border-4 border-border shadow-inner">
							<Webcam
								audio={false}
								ref={webcamRef}
								screenshotFormat="image/jpeg"
								className="w-full h-full object-cover opacity-90"
							/>
							<div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
							<button
								onClick={capture}
								className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-600 rounded-full border-4 border-white/20 shadow-[0_0_20px_rgba(255,0,0,0.5)] active:scale-90 transition-transform hover:border-white"
							/>
						</div>
					)
				) : (
					<div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
						<div className="bg-white p-3 pb-12 shadow-xl transform rotate-1 transition-transform hover:rotate-0 duration-500 max-w-full relative inline-block">
							<div>
								<div className="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-8 border-x-4 border-t-4 border-gray-400 rounded-t-md z-10" />

								<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#1a1a1a] rounded-sm shadow-lg z-20 flex items-center justify-center border-t border-gray-600">
									<div className="w-full h-[1px] bg-white/20 mb-3" />
								</div>
							</div>

							<div className="relative min-w-[300px] max-w-[600px] bg-gray-100 border border-gray-300 overflow-hidden">
								<Image
									src={image}
									alt="Original Specimen"
									width={0}
									height={0}
									sizes="100vw"
									className="w-full h-auto block"
									unoptimized
								/>

								{result && activeView === 'detected' && detectedImage && (
									<div className="absolute inset-0 z-10 bg-white">
										<Image
											src={detectedImage}
											alt="YOLO Detection Result"
											fill
											className="object-contain"
											unoptimized
										/>
									</div>
								)}
							</div>

							<div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
								<span className="font-mono italic text-gray-800 text-sm font-bold">
									Specimen_ID: #2004
								</span>
								<span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
									{activeView} MODE
								</span>
							</div>
						</div>

						<div className="mt-8 flex flex-col items-center gap-6 w-full">
							{result && (
								<div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2 bg-black/20 rounded-lg border border-border/50">
									<button
										onClick={() => setActiveView('original')}
										className={clsx(
											'flex items-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-bold font-mono transition-all border border-transparent cursor-pointer',
											activeView === 'original'
												? 'bg-primary text-black shadow-[2px_2px_0px_#000]'
												: 'text-secondary hover:text-primary hover:border-border'
										)}
									>
										<Eye size={14} /> ORIGINAL
									</button>

									<button
										onClick={() => setActiveView('detected')}
										className={clsx(
											'flex items-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-bold font-mono transition-all border border-transparent cursor-pointer',
											activeView === 'detected'
												? 'bg-primary text-black shadow-[2px_2px_0px_#000]'
												: 'text-secondary hover:text-primary hover:border-border'
										)}
									>
										<Scan size={14} /> DETECTED
									</button>
								</div>
							)}

							<div className="flex gap-4">
								<button
									onClick={handleReset}
									className="px-6 py-3 font-mono text-sm font-bold border-2 border-border text-secondary hover:text-primary hover:bg-white/5 transition-colors uppercase rounded-sm cursor-pointer"
								>
									{result ? 'New Scan' : 'Cancel'}
								</button>

								{!result && (
									<button
										onClick={handleGenerate}
										disabled={isProcessing}
										className="px-8 py-3 bg-accent text-white font-mono text-sm font-bold border-2 border-accent hover:bg-red-600 transition-colors uppercase flex items-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm cursor-pointer"
									>
										{isProcessing ? (
											<RefreshCw
												className="animate-spin"
												size={16}
											/>
										) : (
											<CheckCircle2 size={16} />
										)}
										{isProcessing ? 'Analyzing...' : 'Run YOLOv11'}
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>

			<AnimatePresence>
				{notification && (
					<motion.div
						initial={{ opacity: 0, rotate: 10, y: 50 }}
						animate={{ opacity: 1, rotate: 2, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className="absolute -bottom-16 -right-4 sm:-right-12 z-50"
					>
						<div className="bg-[#fef08a] text-black p-4 w-64 shadow-[4px_4px_10px_rgba(0,0,0,0.5)] transform rotate-2 border border-yellow-600">
							<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-sm border border-red-800" />
							<div className="flex items-start gap-3 mt-1">
								<AlertTriangle
									className="text-red-600 shrink-0 mt-0.5"
									size={20}
								/>
								<div>
									<h4 className="font-bold font-mono text-base uppercase mb-1 border-b border-black/20 pb-1">
										Lab Alert
									</h4>
									<p className="font-mono italic text-sm leading-tight">{notification}</p>
								</div>
								<button
									onClick={() => setNotification(null)}
									className="ml-auto text-black/40 hover:text-black"
								>
									<X size={16} />
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
