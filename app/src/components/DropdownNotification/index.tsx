import { useState } from 'react';
import { Link } from 'react-router-dom';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <li className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>

        <svg
          className="fill-current duration-300 ease-in-out"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4499 13.575 15.4499 13.3687V8.99995C15.4499 6.23745 13.7812 3.92807 11.2499 3.17495V2.62495C11.2499 1.97182 10.7156 1.43745 10.0624 1.43745C9.40935 1.43745 8.87498 1.97182 8.87498 2.62495V3.17495C6.34373 3.92807 4.67498 6.23745 4.67498 8.99995V13.3687C4.67498 13.575 4.5999 13.8937 4.48115 14.0624L3.91865 14.9343C3.7124 15.2531 3.5999 15.6187 3.5999 15.9843C3.5999 16.7249 4.19365 17.3187 4.93428 17.3187H15.1906C15.9312 17.3187 16.5249 16.7249 16.5249 15.9843C16.4687 15.6187 16.3562 15.2531 16.1999 14.9343ZM5.15615 8.99995C5.15615 6.42182 7.2562 4.32182 9.83433 4.32182H10.2937C12.8718 4.32182 14.9718 6.42182 14.9718 8.99995V13.3687C14.9718 13.7062 15.0749 14.0437 15.2312 14.3343L15.7937 15.2062H4.3499L4.91240 14.3343C5.069 14.0437 5.17185 13.7062 5.17185 13.3687V8.99995H5.15615ZM10.0624 2.1562C10.2937 2.1562 10.4781 2.34057 10.4781 2.57182V2.9812C10.2937 2.95932 10.1093 2.95932 9.92498 2.95932C9.74061 2.95932 9.55623 2.95932 9.37186 2.9812V2.57182C9.37186 2.34057 9.55623 2.1562 9.77186 2.1562H10.0624ZM10.0624 17.7562C9.40935 17.7562 8.87498 17.2218 8.87498 16.5687H11.2499C11.2499 17.2218 10.7156 17.7562 10.0624 17.7562Z"
            fill=""
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
          <div className="px-4.5 py-3">
            <h5 className="text-sm font-medium text-bodydark2">Notifications</h5>
          </div>

          <ul className="flex h-auto flex-col overflow-y-auto">
            <li>
              <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="#"
              >
                <p className="text-sm">
                  <span className="text-black dark:text-white">
                    New notification
                  </span>{' '}
                  You have a new message
                </p>

                <p className="text-xs">12 min ago</p>
              </Link>
            </li>
            {/* Add more notification items as needed */}
          </ul>
        </div>
      )}
    </li>
  );
};

export default DropdownNotification;
