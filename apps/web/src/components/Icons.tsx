const base = { className: "ico", viewBox: "0 0 24 24", "aria-hidden": true } as const;

export const StoreIcon = () => <svg {...base}><path d="M4 9l1.5-5h13L20 9" /><path d="M4 9v11h16V9" /><path d="M10 20v-6h4v6" /></svg>;
export const InfoIcon = () => <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></svg>;
export const SparkIcon = () => <svg {...base}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></svg>;
export const BagIcon = () => <svg {...base}><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8a3 3 0 016 0" /></svg>;
