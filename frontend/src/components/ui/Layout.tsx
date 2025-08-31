import Navbar from './Navbar';
import bg from '../../assets/bg.svg';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center">
        {children}
      </main>
    </div>
  );
}
