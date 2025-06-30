import { Layout } from './components/Layout'
import { Header } from './components/Header'
import { Transcript } from './components/Transcript'
import { Preview } from './components/Preview'
import { Toast } from './components/Toast'

function App() {
  return (
    <>
      <Layout header={<Header />}>
        <div className="flex-1 flex gap-4 p-4 max-w-[1440px] mx-auto w-full min-h-full">
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <Transcript />
          </div>
          <div className="w-[480px] bg-white rounded-lg shadow-sm overflow-hidden">
            <Preview />
          </div>
        </div>
      </Layout>
      <Toast />
    </>
  );
}

export default App;
