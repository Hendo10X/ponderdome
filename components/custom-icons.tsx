export const DuckIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.5 6C8.5 4.61929 9.61929 3.5 11 3.5C12.3807 3.5 13.5 4.61929 13.5 6V6.5H8.5V6Z" />
    <path d="M13.5 6.5C13.5 7.88071 14.6193 9 16 9H18.5V11.5H16C14.6193 11.5 13.5 12.6193 13.5 14V14.5H2.5V14C2.5 9.85786 5.85786 6.5 10 6.5H13.5Z" />
    <path d="M13.5 16.5H19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="17.5" cy="7.5" r="1.5" fill="white" />
  </svg>
); // Simplified duck shape (head+beak, body)

export const CommentIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3C6.47715 3 2 6.47715 2 10.7647C2 13.1558 3.0645 15.3031 4.83984 16.7828C4.54284 17.8443 3.90597 18.7302 3.03687 19.349C2.43393 19.7808 2.37899 20.6559 2.92484 21.1633C3.47069 21.6707 4.35414 21.5794 4.97887 20.9592C5.97544 20.0357 7.2185 19.4678 8.52941 19.3275C9.61053 19.648 10.7765 19.8235 12 19.8235C17.5228 19.8235 22 16.3464 22 12.0588C22 7.77123 17.5228 3 12 3Z"
    />
  </svg>
);

export const LeaderboardIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 20V12H10V20H6Z" />
    <path d="M14 20V8H18V20H14Z" />
    <path d="M13.5 4L21 8L13.5 12L6 8L13.5 4Z" />
  </svg> // Podium/Chart hybrid
);
