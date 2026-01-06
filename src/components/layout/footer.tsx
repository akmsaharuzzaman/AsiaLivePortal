import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary-foreground text-gray-100 w-full">
      <div className="w-full container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="py-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            {/* Cards Section */}
            <div className="flex items-center gap-x-2.5 min-w-[150px] justify-center sm:justify-start"></div>
            {/* All Rights Reserved Section */}
            <div className="text-center sm:text-center grow w-full flex flex-col items-center justify-center gap-2 [&_a]:text-(--footer-link-color)! [&_a:hover]:underline!">
              <div className="flex w-full gap-3 items-center justify-center flex-nowrap flex-row">
                <Link
                  className="text-sm text-[var(--navbar-link-color)] underline-offset-4 hover:underline font-medium px-1"
                  to="/terms-and-conditions"
                  color="dark"
                >
                  Terms and Conditions
                </Link>
                <p className="">|</p>
                <Link
                  className="text-sm underline-offset-4 hover:underline font-medium px-1"
                  to="/privacy-policy"
                  color="dark"
                >
                  Privacy Policy
                </Link>
              </div>
              <p className="text-sm text-(--footer-link-color)! tiptap">
                © 2025{" "}
                <Link className="font-bold" to="/">
                  Asia Live Pro Admin
                </Link>{" "}
                All Rights are reserved️
              </p>
            </div>
            {/* Social Links Section */}
            <div className="flex justify-center sm:justify-end space-x-4 min-w-[150px]">
              <a
                className="inline-block rounded-md p-2"
                href="#"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  data-lucide="facebook"
                  style={{
                    width: "1.3em",
                    height: "1.3em",
                    color: "",
                    opacity: 1,
                  }}
                  className="lucide lucide-facebook shrink-0 stroke-[1.5] text-(--footer-link-color)"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
