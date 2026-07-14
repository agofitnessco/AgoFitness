export default function BagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
      <path d="M6.2 8.5h11.6l1.05 11.2a1.4 1.4 0 0 1-1.4 1.5H6.55a1.4 1.4 0 0 1-1.4-1.5L6.2 8.5Z" />
    </svg>
  );
}
