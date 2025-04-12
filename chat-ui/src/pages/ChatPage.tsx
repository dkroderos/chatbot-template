import Conversations from "../layout/Conversations";
import Header from "../layout/Header";

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Conversations />
    </div>
  );
};

export default ChatPage;
