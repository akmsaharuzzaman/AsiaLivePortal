import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LiveListsPage() {
  const [videoHosts] = useState([
    {
      _id: "68b824587627d6f6b4612893",
      name: "mimi🎀",
      avatar:
        "https://res.cloudinary.com/dmpktzr0m/image/upload/v1763743387/user_profiles/user_profiles/32497967410238ff0343ae92caeb40250b5e0eeeec9eb8bcd4831564682d4895.jpg",
      uid: "100110832453067198953",
      level: 3,
      activityZone: { zone: "safe" },
    },
  ]);

  const [audioHosts] = useState([
    {
      _id: "68c2f07a0e6bc9b80cc3bc7a",
      name: "𓂀𝐃𝐋𓂀 jennie🖤",
      avatar:
        "https://res.cloudinary.com/dmpktzr0m/image/upload/v1763894480/user_profiles/user_profiles/4bf9890355a729f7a480be3bdacc2f519d366d0fd70187d1971994fc5547388d.jpg",
      uid: "100566128456694490444",
    },
  ]);

  const [selectedLive, setSelectedLive] = useState(null);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Live Hosts</h1>

      {/* VIDEO HOSTS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Video Live Hosts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoHosts.map((host) => (
            <Card
              key={host._id}
              className="cursor-pointer hover:shadow-xl transition"
              onClick={() => setSelectedLive({ ...host, type: "video" })}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <img
                  src={host.avatar}
                  alt={host.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{host.name}</p>
                  <p className="text-sm text-gray-500">UID: {host.uid}</p>
                  <p className="text-xs text-gray-400">Level: {host.level}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AUDIO HOSTS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Audio Live Hosts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audioHosts.map((host) => (
            <Card
              key={host._id}
              className="cursor-pointer hover:shadow-xl transition"
              onClick={() => setSelectedLive({ ...host, type: "audio" })}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <img
                  src={host.avatar}
                  alt={host.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{host.name}</p>
                  <p className="text-sm text-gray-500">UID: {host.uid}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* LIVE DETAILS MODAL */}
      {selectedLive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-xl font-bold">Live Details</h2>

            <div className="flex items-center gap-4">
              <img
                src={selectedLive.avatar}
                alt={selectedLive.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">{selectedLive.name}</p>
                <p className="text-sm text-gray-600">UID: {selectedLive.uid}</p>
                <p className="text-xs text-gray-500 capitalize">
                  Live Type: {selectedLive.type}
                </p>
              </div>
            </div>

            {/* Demo joined users */}
            <div>
              <h3 className="font-semibold mb-2">Joined Users</h3>
              <ul className="space-y-2">
                {["User A", "User B", "User C"].map((user, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
                  >
                    <span>{user}</span>
                    <Button variant="destructive" size="sm">
                      Ban
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setSelectedLive(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
