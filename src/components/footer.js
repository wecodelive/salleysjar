export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#E7E5E4]">
            {/* About Section */}
            <div className="px-4 py-8 border-b border-[#E7E5E4]">
                <h2 className="text-[#79716B] font-medium tracking-[3.2px] mb-6">
                    ABOUT
                </h2>
                <div className="space-y-4">
                    <p className="text-[#1C1917] leading-6">
                        Salley's Jar is a one-person kitchen run by Tomi, baking small chops
                        and pastries fresh for students during Hall Week. Every order is
                        made the same morning it's delivered.
                    </p>
                    <p className="text-[#79716B] leading-6">
                        For bulk orders or custom requests, message us on WhatsApp at
                        +234 810 685 8963.
                    </p>
                </div>
            </div>

            {/* Footer Info */}
            <div className="px-4 py-8 text-center">
                <p className="text-[#79716B] text-sm tracking-[2.4px]">
                    SALLEY'S JAR · OPEN DAILY 9AM – 7PM
                </p>
            </div>
        </footer>
    );
}
