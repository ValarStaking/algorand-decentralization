import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OperatorsTable from "@/components/OperatorsTable/OperatorsTable";
import Overview from "@/components/Overview";
import { AppProvider } from "@/providers/AppProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-neutral-500 via-primary-50/30 to-secondary-500">
          <Header />
          <main className="mx-auto max-w-7xl space-y-8 px-6 pt-8 lg:px-8">
            <Hero />
            <div className="flex flex-col space-y-8">
              <Overview />
              <OperatorsTable />
              <FAQ />
            </div>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
