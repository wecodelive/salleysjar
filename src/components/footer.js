export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#E7E5E4]">
            {/* About Section */}
            <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16 border-b border-[#E7E5E4]">
                <h2 className="text-[#79716B] font-medium tracking-[3.2px] mb-8 md:mb-10 lg:mb-12 text-xs md:text-sm lg:text-base">
                    ABOUT
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {/* Main Description */}
                    <div>
                        <p className="text-[#1C1917] leading-7 md:leading-8 text-sm md:text-base font-medium mb-4">
                            Salley's Jar
                        </p>
                        <p className="text-[#1C1917] leading-6 md:leading-7 text-sm md:text-base">
                            A one-person kitchen run by Salley, baking small chops and pastries fresh. Every order is made the same morning it's delivered.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <p className="text-[#79716B] leading-7 md:leading-8 text-sm md:text-base font-medium mb-4">
                            Bulk Orders
                        </p>
                        <p className="text-[#79716B] leading-6 md:leading-7 text-sm md:text-base">
                            For custom requests or large orders, message us on WhatsApp at <span className="text-[#1C1917] font-medium">+234 810 685 8963</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="px-4 md:px-8 lg:px-12 py-8 md:py-10 lg:py-12 text-center border-t border-[#E7E5E4]">
                <p className="text-[#79716B] text-xs md:text-sm tracking-[2.4px] font-medium">
                    SALLEY'S JAR · OPEN DAILY 9AM – 7PM
                </p>
            </div>
        </footer>
    );
}
