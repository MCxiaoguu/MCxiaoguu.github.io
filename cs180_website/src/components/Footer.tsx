
export function Footer() {
  return (
    <footer className="text-[15px] w-full mx-4 md:mx-12 lg:mx-[100px] my-[20px]">
      <div className="flex justify-between items-center">
        <ul className="flex">
          <li className="float-left relative mx-[10px]">
            <span className="text-[#222] dark:text-[#e5e5e5]">© 2025 <a 
              href="/about"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            > Hanyang Gu </a></span>
          </li>
        </ul>


      </div>
    </footer>
  );
} 