import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Routes>
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
