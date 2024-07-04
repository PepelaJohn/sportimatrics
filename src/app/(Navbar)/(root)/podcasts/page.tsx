import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col text-gray-100">
      <Head>
        <title>Podcasts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <main className="flex-grow">
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SpotiMetrics</h1>
          <p className="text-xl mb-8">Analyze your Spotify listening habits like never before!</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-500">Get Started</button>
        </section>

        <section id="features" className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Recent Songs</h3>
              <p>See the songs you've listened to recently.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Top Artists</h3>
              <p>Discover your most played artists.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Top Songs</h3>
              <p>Find out your top tracks.</p>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p>"SpotiMetrics transformed how I understand my music preferences!"</p>
              <p className="mt-2 font-bold">- Alex</p>
            </div>
            <div>
              <p>"A must-have tool for any Spotify enthusiast."</p>
              <p className="mt-2 font-bold">- Taylor</p>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>Contact us: info@spotimetrics.com</p>
          <div className="mt-4">
            <a href="#" className="mx-2 hover:text-blue-400">Facebook</a>
            <a href="#" className="mx-2 hover:text-blue-400">Twitter</a>
            <a href="#" className="mx-2 hover:text-blue-400">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
