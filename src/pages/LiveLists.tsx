// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function LiveListsPage() {
//   const [videoHosts] = useState([
//     {
//       _id: "68b824587627d6f6b4612893",
//       name: "mimi🎀",
//       avatar:
//         "https://res.cloudinary.com/dmpktzr0m/image/upload/v1763743387/user_profiles/user_profiles/32497967410238ff0343ae92caeb40250b5e0eeeec9eb8bcd4831564682d4895.jpg",
//       uid: "100110832453067198953",
//       level: 3,
//       activityZone: { zone: "safe" },
//     },
//   ]);

//   const [audioHosts] = useState([
//     {
//       _id: "68c2f07a0e6bc9b80cc3bc7a",
//       name: "𓂀𝐃𝐋𓂀 jennie🖤",
//       avatar:
//         "https://res.cloudinary.com/dmpktzr0m/image/upload/v1763894480/user_profiles/user_profiles/4bf9890355a729f7a480be3bdacc2f519d366d0fd70187d1971994fc5547388d.jpg",
//       uid: "100566128456694490444",
//     },
//   ]);

//   const [selectedLive, setSelectedLive] = useState(null);

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-2xl font-bold">Live Hosts</h1>

//       {/* VIDEO HOSTS */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4">Video Live Hosts</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {videoHosts.map((host) => (
//             <Card
//               key={host._id}
//               className="cursor-pointer hover:shadow-xl transition"
//               onClick={() => setSelectedLive({ ...host, type: "video" })}
//             >
//               <CardContent className="flex items-center gap-4 p-4">
//                 <img
//                   src={host.avatar}
//                   alt={host.name}
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="font-semibold">{host.name}</p>
//                   <p className="text-sm text-gray-500">UID: {host.uid}</p>
//                   <p className="text-xs text-gray-400">Level: {host.level}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* AUDIO HOSTS */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4">Audio Live Hosts</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {audioHosts.map((host) => (
//             <Card
//               key={host._id}
//               className="cursor-pointer hover:shadow-xl transition"
//               onClick={() => setSelectedLive({ ...host, type: "audio" })}
//             >
//               <CardContent className="flex items-center gap-4 p-4">
//                 <img
//                   src={host.avatar}
//                   alt={host.name}
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="font-semibold">{host.name}</p>
//                   <p className="text-sm text-gray-500">UID: {host.uid}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* LIVE DETAILS MODAL */}
//       {selectedLive && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
//             <h2 className="text-xl font-bold">Live Details</h2>

//             <div className="flex items-center gap-4">
//               <img
//                 src={selectedLive.avatar}
//                 alt={selectedLive.name}
//                 className="w-20 h-20 rounded-full object-cover"
//               />
//               <div>
//                 <p className="font-semibold text-lg">{selectedLive.name}</p>
//                 <p className="text-sm text-gray-600">UID: {selectedLive.uid}</p>
//                 <p className="text-xs text-gray-500 capitalize">
//                   Live Type: {selectedLive.type}
//                 </p>
//               </div>
//             </div>

//             {/* Demo joined users */}
//             <div>
//               <h3 className="font-semibold mb-2">Joined Users</h3>
//               <ul className="space-y-2">
//                 {["User A", "User B", "User C"].map((user, idx) => (
//                   <li
//                     key={idx}
//                     className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
//                   >
//                     <span>{user}</span>
//                     <Button variant="destructive" size="sm">
//                       Ban
//                     </Button>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="flex justify-end">
//               <Button onClick={() => setSelectedLive(null)}>Close</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import useLiveHosts from "@/hook/useLiveHosts";
import React, { useEffect, useState } from "react";

// Mock data based on the image structure
const streams = [
  {
    id: 1,
    title: "Adda Ghor",
    description: "Welcome everyone!",
    viewerCount: 0,
    thumbnailUrl: "https://placehold.co/400x300/1e293b/ffffff?text=Stream+1",
  },
  {
    id: 2,
    title: "Adda Ghor",
    description: "Welcome everyone!",
    viewerCount: 1200, // Updated to 1200 for proper K formatting
    thumbnailUrl: "https://placehold.co/400x300/4c0519/ffffff?text=Stream+2",
  },
  {
    id: 3,
    title: "Adda Ghor",
    description: "Welcome everyone!",
    viewerCount: 78,
    thumbnailUrl: "https://placehold.co/400x300/065f46/ffffff?text=Stream+3",
  },
  // Adding a fourth card to demonstrate the responsive grid better
  {
    id: 4,
    title: "Live Chat",
    description: "Join the conversation now!",
    viewerCount: 250,
    thumbnailUrl: "https://placehold.co/400x300/075985/ffffff?text=Stream+4",
  },
];

// Helper component for the Live Stream Card
const LiveStreamCard = ({
  id,
  title,
  description,
  viewerCount,
  thumbnailUrl,
}) => {
  // Format viewer count to show K if over 1000
  const formattedViewers =
    viewerCount >= 1000 ? `${(viewerCount / 1000).toFixed(1)}K` : viewerCount;
  LiveStreamCard;
  // Handler for the Ban button click
  const handleBanClick = (e) => {
    // Prevent the card click event from firing when the button is pressed
    e.stopPropagation();
    console.log(`Action: Banning Stream ID ${id} - "${title}"`);
    // In a real app, this is where you would call an API endpoint to ban the stream
  };

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden bg-white shadow-lg
                    hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
      // Added an onClick to the card itself (simulating navigating to the stream)
      onClick={() => console.log(`Navigating to Stream ID ${id}`)}
    >
      {/* Thumbnail Area */}
      <div className="relative w-full h-64">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          // Fallback image in case the placeholder fails
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x300/6b7280/ffffff?text=Error";
          }}
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
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center space-x-1">
          {/* Eye Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 4.5c4.71 0 8.87 2.37 10.87 5.5.17.27.17.6 0 .87-2 3.13-6.16 5.5-10.87 5.5S3.13 13.99 1.13 10.87c-.17-.27-.17-.6 0-.87C3.13 6.87 7.29 4.5 12 4.5zm0 10A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7z" />
          </svg>
          <span>{formattedViewers}</span>
        </div>
      </div>

      {/* Content Area - Uses flex to align text and button */}
      <div className="p-3 flex justify-between items-center">
        {/* Text Details (Left side) */}
        <div className="flex-grow min-w-0 pr-2">
          <h2 className="text-lg font-semibold text-gray-900 leading-tight truncate">
            {title}
          </h2>
          <p className="text-green-600 text-base mt-1 leading-snug">
            {description}
          </p>
        </div>

        {/* Ban Button (Right side) */}
        <button
          onClick={handleBanClick}
          className="text-xs font-semibold px-3 py-1 bg-red-600 text-white rounded-full
                       hover:bg-red-700 transition duration-150 shadow-md flex-shrink-0"
          title={`Ban stream ${id}`}
        >
          Ban
        </button>
      </div>
    </div>
  );
};

// Main App Component
export const LiveListsPage = () => {
  const [activeUserId] = useState<string | null>("ss");

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

  console.log(videoHosts, "video");
  console.log(audioHosts, "audio");
  return (
    <div className="min-h-screen p-4 sm:p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
          Video Hosts Live Streams
        </h1>

        {/* Responsive Grid */}
        <div
          className="grid gap-6
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4"
        >
          {videoHosts.map((stream) => (
            <LiveStreamCard
              key={stream._id}
              id={stream.uid} // Pass ID for the ban function
              title={stream.name}
              description={"Welcome everyone!"}
              viewerCount={125}
              thumbnailUrl={stream.avatar}
            />
          ))}
        </div>
      </div>

      {/*AUDIO HOSTS LIVE STREAM*/}
      <div className="max-w-7xl mx-auto mt-20">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
          Audio Hosts Live Streams
        </h1>

        {/* Responsive Grid */}
        <div
          className="grid gap-6
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4"
        >
          {audioHosts.map((stream) => (
            <LiveStreamCard
              key={stream._id}
              id={stream.uid} // Pass ID for the ban function
              title={stream.name}
              description={"Welcome everyone!"}
              viewerCount={125}
              thumbnailUrl={stream.avatar}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveListsPage;
