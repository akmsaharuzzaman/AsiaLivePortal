
import { BlockZoneModal } from "@/components/dialog/block-zone-modal";
import useLiveHosts from "@/hook/useLiveHosts";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

const LiveStreamCard = ({
  uid,
  title,
  description,
  // viewerCount,
  thumbnailUrl,
  handleBan,
}: any) => {
  // Format viewer count to show K if over 1000
  // const formattedViewers =
  //   viewerCount >= 1000 ? `${(viewerCount / 1000).toFixed(1)}K` : viewerCount;

  // Handler for the Ban button click
  // const handleBanClick = (e) => {
  //   // Prevent the card click event from firing when the button is pressed
  //   e.stopPropagation();
  //   console.log(`Action: Banning Stream ID ${id} - "${title}"`);
  //   // In a real app, this is where you would call an API endpoint to ban the stream
  // };

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg
                    hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
      // Added an onClick to the card itself (simulating navigating to the stream)
      onClick={() => console.log(`Navigating to Stream ID ${uid}`)}
    >
      {/* Thumbnail Area */}
      <div className="relative w-full h-64">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          // Fallback image in case the placeholder fails
          // onError={(e) => {
          //   e.target.onerror = null;
          //   e.target.src =
          //     "https://placehold.co/400x300/6b7280/ffffff?text=Error";
          // }}
        />

        {/* Live Indicator (Top Left) */}
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center shadow-md">
          {/* Red Dot SVG */}
          <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" />
          </svg>
          LIVE
        </div>

        {/* Viewer Count (Bottom Right) */}
        {/* <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center space-x-1">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 4.5c4.71 0 8.87 2.37 10.87 5.5.17.27.17.6 0 .87-2 3.13-6.16 5.5-10.87 5.5S3.13 13.99 1.13 10.87c-.17-.27-.17-.6 0-.87C3.13 6.87 7.29 4.5 12 4.5zm0 10A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7z" />
          </svg>
          <span>{formattedViewers}</span>
        </div> */}
      </div>

      {/* Content Area - Uses flex to align text and button */}
      <div className="p-3 flex justify-between items-center">
        {/* Text Details (Left side) */}
        <div className="flex-grow min-w-0 pr-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight truncate">
            {title}
          </h2>
          <p className="text-green-600 dark:text-green-400 text-base mt-1 leading-snug">
            {description}
          </p>
        </div>

        {/* Ban Button (Right side) */}
        <button
          onClick={() => handleBan(uid)}
          className="text-xs font-semibold px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition duration-150 shadow-md flex-shrink-0"
          title={`Ban stream ${uid}`}
        >
          Ban
        </button>
      </div>
    </div>
  );
};

// Main App Component
export const LiveListsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const activeUserId = user?.id || null;
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const handleBan = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const {
    videoHosts,
    audioHosts,
    // errors,
    connected,
    requestVideoHosts,
    requestAudioHosts,
  } = useLiveHosts(activeUserId);

  // when connected, automatically request latest hosts (safe to call repeatedly)
  useEffect(() => {
    if (!connected) return;
    // request current lists after connect
    requestVideoHosts();
    requestAudioHosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const selectedLive = videoHosts.find((l) => l._id === selectedId) || audioHosts.find((l) => l._id === selectedId) || null;
  console.log(videoHosts, "video");
  console.log(audioHosts, "audio");
  return (
    <>
      <div className="min-h-screen p-4 sm:p-8 font-inter bg-white dark:bg-transparent text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 mb-8">
            Video Hosts Live Streams
          </h1>

          {/* Responsive Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videoHosts.map((stream) => (
              <LiveStreamCard
                key={stream._id}
                uid={stream._id} // Pass ID for the ban function
                title={stream.name}
                description={"Welcome everyone!"}
                // viewerCount={125}
                thumbnailUrl={stream.avatar}
                handleBan={handleBan}
              />
            ))}
          </div>
        </div>

        {/*AUDIO HOSTS LIVE STREAM*/}
        <div className="max-w-7xl mx-auto mt-20">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 mb-8">
            Audio Hosts Live Streams
          </h1>

          {/* Responsive Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {audioHosts.map((stream) => (
              <LiveStreamCard
                key={stream._id}
                uid={stream._id} // Pass ID for the ban function
                title={stream.name}
                description={"Welcome everyone!"}
                // viewerCount={125}
                thumbnailUrl={stream.avatar}
                handleBan={handleBan}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Modal Integration (inline component to avoid import resolution issues) */}
      <BlockZoneModal
        open={open}
        setOpen={setOpen}
        liveId={selectedId}
        liveTitle={selectedLive?.name}
      />
    </>
  );
};

export default LiveListsPage;
