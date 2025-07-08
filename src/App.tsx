import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { TranscriptContainer } from './containers/TranscriptContainer';
import { VideoPlayerContainer } from './containers/VideoPlayerContainer';
import { Toast } from './components/Toast';

function App() {
  return (
    <>
      <Layout header={<Header />}>
        <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 max-w-[1440px] mx-auto w-full min-h-0 h-[calc(100vh-76px)]">
          <div className="order-2 lg:order-1 h-[calc(50vh-60px)] lg:h-full lg:w-[400px] bg-secondary-50 rounded-lg shadow-lg overflow-hidden border border-secondary-200">
            <TranscriptContainer />
          </div>
          <div className="order-1 lg:order-2 h-[calc(50vh-60px)] lg:h-full flex-1 bg-secondary-900 rounded-lg shadow-lg overflow-hidden border border-secondary-800">
            <VideoPlayerContainer />
          </div>
        </div>
      </Layout>
      <Toast />
    </>
  );
}

export default App;
