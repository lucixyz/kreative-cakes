import { ArrowRight, Check, Handbag, Heart, Info, List, Plus, Receipt, Sparkle, Storefront, Trash, X } from "@phosphor-icons/react";

// One icon family (Phosphor, regular weight) for the whole storefront. Decorative: always aria-hidden.
const SIZE = 20;
export const StoreIcon = () => <Storefront size={SIZE} aria-hidden="true" />;
export const InfoIcon = () => <Info size={SIZE} aria-hidden="true" />;
export const SparkIcon = () => <Sparkle size={SIZE} aria-hidden="true" />;
export const BagIcon = () => <Handbag size={SIZE} aria-hidden="true" />;
export const HeartIcon = ({ filled = false }: { filled?: boolean }) => <Heart size={SIZE} weight={filled ? "fill" : "regular"} aria-hidden="true" />;
export const MenuIcon = ({ open }: { open: boolean }) => (open ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />);
export const CloseIcon = () => <X size={12} weight="bold" aria-hidden="true" />;
export const TrashIcon = () => <Trash size={SIZE} aria-hidden="true" />;
export const ArrowIcon = () => <ArrowRight size={16} aria-hidden="true" />;
export const CheckIcon = ({ size = 18 }: { size?: number }) => <Check size={size} weight="bold" aria-hidden="true" />;
export const ReceiptIcon = () => <Receipt size={22} aria-hidden="true" />;
export const PlusIcon = () => <Plus size={24} aria-hidden="true" />;
