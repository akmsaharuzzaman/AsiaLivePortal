import { Building2, Check, Loader2, X } from "lucide-react";

export const AgencyRequestModal = ({
  showAgencyModal,
  agencyRequest,
  handleAgencyReject,
  handleAgencyAccept,
  acceptLoading,
  rejectLoading,
}: {
  showAgencyModal: boolean;
  agencyRequest: any;
  handleAgencyReject: any;
  handleAgencyAccept: any;
  rejectLoading: boolean;
  acceptLoading: boolean;
}) => {
  return (
    <div>
      {showAgencyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600 p-6 text-white relative">
              <div className="absolute top-4 right-4 text-white/20">
                <Building2 size={80} />
              </div>
              <h2 className="text-xl font-black mb-1 relative z-10">
                Agency Request Detected
              </h2>
              <p className="text-indigo-100 text-xs relative z-10">
                A new user is requesting to join your agency network.
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={agencyRequest?.userId?.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-lg mx-auto"
                />
                <div className="absolute bottom-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-white">
                  LVL {agencyRequest?.userId?.level}
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-800">
                {agencyRequest?.userId?.name}
              </h3>
              <p className="text-slate-400 text-xs font-medium">
                UID: {agencyRequest?.userId?.uid}
              </p>

              <div className="mt-6 flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Request ID</span>
                  <span className="text-slate-700 font-mono">
                    #{agencyRequest?._id.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Agency ID</span>
                  <span className="text-slate-700 font-mono">
                    {agencyRequest?.agencyId.slice(-8)}...
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => handleAgencyReject(agencyRequest?.userId?._id)}
                  className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-2xl text-xs font-black transition-all"
                  disabled={rejectLoading}
                >
                  {rejectLoading ? (
                    <span>
                      <Loader2 className="w-4 h-4 animate-spin" /> Rejecting...
                    </span>
                  ) : (
                    <span>
                      <X size={16} /> REJECT
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleAgencyAccept(agencyRequest?.userId?._id)}
                  className="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-indigo-100"
                >
                  {acceptLoading ? (
                    <span>
                      <Loader2 className="w-4 h-4 animate-spin" /> Accepting...
                    </span>
                  ) : (
                    <span>
                      <Check size={16} /> ACCEPT
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
