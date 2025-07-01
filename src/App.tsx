import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Transcript } from './components/Transcript';
import { VideoPlayer } from './components/VideoPlayer';
import { Toast } from './components/Toast';

function App() {
  return (
    <>
      <Layout header={<Header />}>
        <div className="flex-1 flex gap-6 p-6 max-w-[1440px] mx-auto w-full h-[calc(100vh-76px)]">
          <div className="w-[400px] bg-white rounded-lg shadow-sm overflow-hidden h-full">
            <Transcript />
          </div>
          <div className="flex-1 bg-gray-900 rounded-lg shadow-sm overflow-hidden h-full">
            <VideoPlayer />
          </div>
        </div>
      </Layout>
      <Toast />
    </>
  );
}

export default App;
