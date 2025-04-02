export const Footer = () => {
    return (
        <footer className="bg-[#ECE6EE] py-12 pl-4 h-40 dark:bg-[#1c1d1f]">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mr-4">Juro AI</div>
                <span className="text-gray-600 text-center md:text-left w-full mt-4 md:mt-0">
                    © {new Date().getFullYear()} Company Name. All rights reserved.
                </span>
            </div>
        </footer>
    )
}