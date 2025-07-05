import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { TranscriptContainer } from './containers/TranscriptContainer';
import { VideoPlayerContainer } from './containers/VideoPlayerContainer';
import { Toast } from './components/Toast';

function App() {
  return (
    <>
      <Layout header={<Header />}>
        <div className="flex-1 flex gap-6 p-6 max-w-[1440px] mx-auto w-full h-[calc(100vh-76px)]">
          <div className="w-[400px] bg-secondary-50 rounded-lg shadow-lg overflow-hidden h-full border border-secondary-200">
            <TranscriptContainer />
          </div>
          <div className="flex-1 bg-secondary-900 rounded-lg shadow-lg overflow-hidden h-full border border-secondary-800">
            <VideoPlayerContainer />
          </div>
        </div>
      </Layout>
      <Toast />
    </>
  );
}

export default App;
