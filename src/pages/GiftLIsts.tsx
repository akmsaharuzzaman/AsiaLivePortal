import React, { useState } from "react";

import { PlusCircle, ArrowLeft } from "lucide-react";
import { useGetAllGiftsQuery } from "@/redux/api/gift.api";

import { useGetGiftCategoriesQuery } from "@/redux/api/auth.api";
import { Link } from "react-router-dom";
import { CreateGiftForm } from "@/components/forms/create-gift-form";
import { GiftCard } from "@/components/cards";
import { TGift } from "@/types/api/gift";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success" | "info" | "ghost";
};

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type GiftListsPageProps = {
  backRoute: string;
};

// Mock Data
// const initialGifts: Gift[] = [
//   {
//     _id: "1",
//     name: "Rose",
//     category: "Popular",
//     diamonds: 50,
//     coinPrice: 100,
//     previewImage: "https://placehold.co/100x100/f87171/ffffff?text=Rose",
//     svgaImage: "rose.svga",
//     createdAt: "2024-08-15T10:00:00Z",
//     updatedAt: "2024-08-15T10:00:00Z",
//   },
//   {
//     _id: "2",
//     name: "Diamond Ring",
//     category: "Luxury",
//     diamonds: 5000,
//     coinPrice: 10000,
//     previewImage: "https://placehold.co/100x100/38bdf8/ffffff?text=Ring",
//     svgaImage: "ring.svga",
//     createdAt: "2024-08-15T11:00:00Z",
//     updatedAt: "2024-08-15T11:00:00Z",
//   },
//   {
//     _id: "3",
//     name: "Teddy Bear",
//     category: "Popular",
//     diamonds: 200,
//     coinPrice: 400,
//     previewImage: "https://placehold.co/100x100/facc15/ffffff?text=Bear",
//     svgaImage: "bear.svga",
//     createdAt: "2024-08-16T14:00:00Z",
//     updatedAt: "2024-08-16T14:00:00Z",
//   },
//   {
//     _id: "4",
//     name: "Sports Car",
//     category: "Luxury",
//     diamonds: 50000,
//     coinPrice: 100000,
//     previewImage: "https://placehold.co/100x100/e11d48/ffffff?text=Car",
//     svgaImage: "car.svga",
//     createdAt: "2024-08-17T09:00:00Z",
//     updatedAt: "2024-08-17T09:00:00Z",
//   },
// ];

// Helper & UI Components (shadcn/ui inspired)
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants: Record<string, string> = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500",
    info: "text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    ghost: "hover:bg-gray-100",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

// const Label: React.FC<LabelProps> = ({ children, ...props }) => (
//   <label
//     className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//     {...props}
//   >
//     {children}
//   </label>
// );

// const Select: React.FC<SelectProps> = ({
//   children,
//   value,
//   onChange,
//   className,
// }) => (
//   <select
//     value={value}
//     onChange={onChange}
//     className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//   >
//     {children}
//   </select>
// );

// Gift Management Components

export const GiftListsPage: React.FC<GiftListsPageProps> = ({
  backRoute = "/",
}) => {
  const { data: giftCategories, isLoading: getCategoryLoading } =
    useGetGiftCategoriesQuery(undefined);
  const { data: allGiftData, isLoading } = useGetAllGiftsQuery(undefined);

  const initialCategories: string[] = giftCategories?.result || [];
  const gifts = allGiftData?.result || [];
  // const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [categories, setCategories] = useState<string[]>([
    ...initialCategories,
  ]);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const groupedGifts = gifts.reduce<Record<string, TGift[]>>((acc, gift) => {
    (acc[gift.category] = acc[gift.category] || []).push(gift);
    return acc;
  }, {});

  const addCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  if (isLoading) return <p>Hello Loading</p>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between mb-8">
        <div>
          <Link
            to={backRoute}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gift Management</h1>
        </div>
        <Button variant="success" onClick={() => setCreateModalOpen(true)}>
          <PlusCircle size={16} className="mr-2" /> Create Gift
        </Button>
      </header>
      <div className="space-y-10">
        {Object.entries(groupedGifts).map(([category, giftList]) => (
          <section key={category}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {giftList.map((gift) => (
                <GiftCard key={gift._id} gift={gift} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Gift"
      >
        <CreateGiftForm
          onSave={() => setCreateModalOpen(false)}
          categories={categories}
          addCategory={addCategory}
          getCategoryLoading={getCategoryLoading}
        />
      </Dialog>
    </div>
  );
};

// ----------------------------------
// import React, { useState, ChangeEvent, FormEvent } from "react";
// import {
//   useGetAllGiftsQuery,
//   useCreateGiftMutation,
//   useDeleteGiftMutation,
// } from "@/redux/api/gift.api";
// import { useGetGiftCategoriesQuery } from "@/redux/api/auth.api";
// import { TGift, TCreateGiftBody } from "@/types/api/gift";
// import {
//   Gamepad2,
//   Coins,
//   UserPlus,
//   Store,
//   UserCog,
//   UserX,
//   History,
//   ListX,
//   Building,
//   UserMinus,
//   Gift,
//   PlusCircle,
//   ArrowLeft,
//   ImageUp,
//   Sparkles,
// } from "lucide-react";
// import { toast } from "sonner";

// // Types
// // ...existing code...

// type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
//   variant?: "primary" | "secondary" | "danger" | "success" | "info" | "ghost";
// };

// type DialogProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// };

// type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

// type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
//   children: React.ReactNode;
// };

// type GiftCardProps = {
//   gift: Gift;
// };

// type CreateGiftFormProps = {
//   onSave: (e?: FormEvent) => void;
//   categories: string[];
//   addCategory: (cat: string) => void;
// };

// type GiftListsPageProps = {
//   onBack: () => void;
// };

// // API integration replaces mock data

// // Helper & UI Components (shadcn/ui inspired)
// const Button: React.FC<ButtonProps> = ({
//   children,
//   onClick,
//   variant = "primary",
//   className = "",
//   ...props
// }) => {
//   const variants: Record<string, string> = {
//     primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
//     secondary:
//       "text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400",
//     danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
//     success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500",
//     info: "text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
//     ghost: "hover:bg-gray-100",
//   };
//   return (
//     <button
//       onClick={onClick}
//       className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const Dialog: React.FC<DialogProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
// }) => {
//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-lg shadow-xl w-full max-w-md"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6 border-b">
//           <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// };

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, ...props }, ref) => (
//     <input
//       className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
//       ref={ref}
//       {...props}
//     />
//   )
// );
// Input.displayName = "Input";

// const Label: React.FC<LabelProps> = ({ children, ...props }) => (
//   <label
//     className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//     {...props}
//   >
//     {children}
//   </label>
// );

// const Select: React.FC<SelectProps> = ({
//   children,
//   value,
//   onChange,
//   className,
// }) => (
//   <select
//     value={value}
//     onChange={onChange}
//     className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//   >
//     {children}
//   </select>
// );

// // Gift Management Components
// const GiftCard: React.FC<GiftCardProps> = ({ gift }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300">
//     <img
//       src={gift.previewImage}
//       alt={gift.name}
//       className="w-full h-32 object-cover"
//       onError={(e) => {
//         (e.target as HTMLImageElement).onerror = null;
//         (e.target as HTMLImageElement).src =
//           "https://placehold.co/100x100/cccccc/ffffff?text=Error";
//       }}
//     />
//     <div className="p-4">
//       <h4 className="text-lg font-semibold text-gray-800">{gift.name}</h4>
//       <div className="flex items-center text-gray-600 mt-1">
//         <Coins size={14} className="mr-1 text-yellow-500" />
//         <span>{gift.coinPrice}</span>
//       </div>
//       <div className="flex items-center text-gray-600 mt-1">
//         <Sparkles size={14} className="mr-1 text-blue-500" />
//         <span>{gift.diamonds} Diamonds</span>
//       </div>
//     </div>
//     <div className="p-2 bg-gray-50 flex justify-end">
//       <Button variant="secondary" className="py-1 px-2 text-xs">
//         Edit
//       </Button>
//     </div>
//   </div>
// );

// const CreateGiftForm: React.FC<
//   CreateGiftFormProps & {
//     onCreateGift: (body: TCreateGiftBody) => void;
//     isLoading: boolean;
//   }
// > = ({ onSave, categories, addCategory, onCreateGift, isLoading }) => {
//   const [selectedCategory, setSelectedCategory] = useState<string>(
//     categories[0] || ""
//   );
//   const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
//   const [newCategoryName, setNewCategoryName] = useState<string>("");
//   const [giftName, setGiftName] = useState<string>("");
//   const [diamonds, setDiamonds] = useState<number>(0);
//   const [coinPrice, setCoinPrice] = useState<number>(0);
//   const [previewImage, setPreviewImage] = useState<File | null>(null);
//   const [svgaImage, setSvgaImage] = useState<File | null>(null);

//   const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     if (e.target.value === "create_new") {
//       setIsCreatingCategory(true);
//     } else {
//       setSelectedCategory(e.target.value);
//       setIsCreatingCategory(false);
//     }
//   };

//   const handleCreateCategory = () => {
//     if (newCategoryName.trim()) {
//       addCategory(newCategoryName.trim());
//       setSelectedCategory(newCategoryName.trim());
//       setIsCreatingCategory(false);
//       setNewCategoryName("");
//     }
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     if (
//       !giftName ||
//       !selectedCategory ||
//       !diamonds ||
//       !coinPrice ||
//       !previewImage ||
//       !svgaImage
//     )
//       return;
//     onCreateGift({
//       giftName,
//       category: selectedCategory,
//       diamonds,
//       coinPrice,
//       previewImage,
//       svgaImage,
//     });
//     onSave();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="giftName">Gift Name</Label>
//         <Input
//           id="giftName"
//           value={giftName}
//           onChange={(e) => setGiftName(e.target.value)}
//           placeholder="e.g., Golden Crown"
//         />
//       </div>
//       <div>
//         <Label htmlFor="category">Category</Label>
//         <div className="flex gap-2">
//           <Select
//             value={selectedCategory}
//             onChange={handleCategoryChange}
//             className="flex-grow"
//           >
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//             <option value="create_new">+ Create New Category</option>
//           </Select>
//         </div>
//         {isCreatingCategory && (
//           <div className="flex gap-2 mt-2">
//             <Input
//               value={newCategoryName}
//               onChange={(e) => setNewCategoryName(e.target.value)}
//               placeholder="New category name"
//             />
//             <Button type="button" onClick={handleCreateCategory}>
//               Add
//             </Button>
//           </div>
//         )}
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label htmlFor="diamonds">Diamonds</Label>
//           <Input
//             id="diamonds"
//             type="number"
//             value={diamonds}
//             onChange={(e) => setDiamonds(Number(e.target.value))}
//             placeholder="500"
//           />
//         </div>
//         <div>
//           <Label htmlFor="coinPrice">Coin Price</Label>
//           <Input
//             id="coinPrice"
//             type="number"
//             value={coinPrice}
//             onChange={(e) => setCoinPrice(Number(e.target.value))}
//             placeholder="1000"
//           />
//         </div>
//       </div>
//       <div>
//         <Label>Preview Image</Label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setPreviewImage(e.target.files?.[0] || null)}
//         />
//       </div>
//       <div>
//         <Label>SVGA Image</Label>
//         <input
//           type="file"
//           accept=".svga"
//           onChange={(e) => setSvgaImage(e.target.files?.[0] || null)}
//         />
//       </div>
//       <div className="flex justify-end gap-3 pt-4">
//         <Button type="button" variant="secondary" onClick={onSave}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Creating..." : "Create Gift"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export const GiftListsPage: React.FC<GiftListsPageProps> = ({ onBack }) => {
//   // API hooks
//   const { data: giftsData, isLoading: giftsLoading } =
//     useGetAllGiftsQuery(undefined);
//   const { data: categoriesData, isLoading: categoriesLoading } =
//     useGetGiftCategoriesQuery(undefined);
//   const [createGift, { isLoading: createLoading }] = useCreateGiftMutation();
//   const [deleteGift] = useDeleteGiftMutation();

//   const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
//   const [categories, setCategories] = useState<string[]>([]);

//   React.useEffect(() => {
//     if (categoriesData?.data) {
//       setCategories(categoriesData.data);
//     }
//   }, [categoriesData]);

//   const addCategory = (newCategory: string) => {
//     if (!categories.includes(newCategory)) {
//       setCategories((prev) => [...prev, newCategory]);
//     }
//   };

//   const handleCreateGift = async (body: TCreateGiftBody) => {
//     try {
//       const res = await createGift(body).unwrap();
//       toast.success(
//         res?.message ||
//           `Gift "${res.result?.name}" created successfully!` ||
//           "created successfully"
//       );
//     } catch (err:any) {
//       // handle error (toast, etc)
//       toast.error(
//         err.data.message ||
//           err.message ||
//           "Failed to create gift. Please try again."
//       );
//     }
//   };

//   const handleDeleteGift = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this gift?")) {
//       try {
//         await deleteGift(id).unwrap();
//       } catch (err) {
//         // handle error
//       }
//     }
//   };

//   // Group gifts by category
//   const gifts: TGift[] = giftsData?.data || [];
//   const groupedGifts = gifts.reduce<Record<string, TGift[]>>((acc, gift) => {
//     (acc[gift.category] = acc[gift.category] || []).push(gift);
//     return acc;
//   }, {});

//   return (
//     <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//       <header className="flex items-center justify-between mb-8">
//         <div>
//           <button
//             onClick={onBack}
//             className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
//           >
//             <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Gift Management</h1>
//         </div>
//         <Button variant="success" onClick={() => setCreateModalOpen(true)}>
//           <PlusCircle size={16} className="mr-2" /> Create Gift
//         </Button>
//       </header>
//       <div className="space-y-10">
//         {giftsLoading ? (
//           <div>Loading gifts...</div>
//         ) : (
//           Object.entries(groupedGifts).map(([category, giftList]) => (
//             <section key={category}>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
//                 {category}
//               </h2>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                 {giftList.map((gift) => (
//                   <div key={gift._id} className="relative">
//                     <GiftCard gift={gift} />
//                     <Button
//                       variant="danger"
//                       className="absolute top-2 right-2 py-1 px-2 text-xs"
//                       onClick={() => handleDeleteGift(gift._id)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           ))
//         )}
//       </div>
//       <Dialog
//         isOpen={isCreateModalOpen}
//         onClose={() => setCreateModalOpen(false)}
//         title="Create New Gift"
//       >
//         <CreateGiftForm
//           onSave={() => setCreateModalOpen(false)}
//           categories={categories}
//           addCategory={addCategory}
//           onCreateGift={handleCreateGift}
//           isLoading={createLoading}
//         />
//       </Dialog>
//     </div>
//   );
// };
