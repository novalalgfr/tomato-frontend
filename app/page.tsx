import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import InputArea from './components/input/InputArea';

export default function Home() {
	return (
		<main className="flex flex-col space-y-16">
			<Navbar />

			<Hero />

			<div className="w-full animate-fade-in delay-100">
				<InputArea />
			</div>

			<Footer />
		</main>
	);
}
