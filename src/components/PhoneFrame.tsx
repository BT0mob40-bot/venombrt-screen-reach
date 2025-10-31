interface PhoneFrameProps {
  screenshot: string;
  platform: string;
  name: string;
}

export const PhoneFrame = ({ screenshot, platform, name }: PhoneFrameProps) => {
  const isIOS = platform.toLowerCase() === 'ios';
  
  return (
    <div className="relative inline-block">
      {isIOS ? (
        // iPhone Frame
        <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-3 shadow-2xl">
          {/* iPhone notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-10"></div>
          
          {/* Screen */}
          <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
            {/* iOS status bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/20 to-transparent z-10 flex items-center justify-between px-6 text-xs text-white">
              <span>9:41</span>
              <div className="flex gap-1 items-center">
                <div className="w-4 h-3 border border-white rounded-sm"></div>
                <div className="w-4 h-3 border border-white rounded-sm"></div>
                <div className="w-4 h-3 border border-white rounded-sm"></div>
              </div>
            </div>
            
            <img 
              src={screenshot} 
              alt={name}
              className="w-full h-full object-cover"
            />
            
            {/* iOS home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
          </div>
          
          {/* Side buttons */}
          <div className="absolute right-0 top-24 w-1 h-12 bg-gray-800 rounded-l"></div>
          <div className="absolute left-0 top-20 w-1 h-8 bg-gray-800 rounded-r"></div>
          <div className="absolute left-0 top-32 w-1 h-12 bg-gray-800 rounded-r"></div>
          <div className="absolute left-0 top-48 w-1 h-12 bg-gray-800 rounded-r"></div>
        </div>
      ) : (
        // Android Frame
        <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="relative w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
            {/* Android status bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10 flex items-center justify-between px-4 text-xs text-white">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-white/70"></div>
                <span className="text-[10px]">5G</span>
              </div>
              <span className="text-[10px]">9:41</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-2 border border-white rounded-sm"></div>
                <div className="w-3 h-2 border border-white rounded-sm"></div>
                <div className="w-3 h-2 border border-white rounded-sm"></div>
              </div>
            </div>
            
            <img 
              src={screenshot} 
              alt={name}
              className="w-full h-full object-cover"
            />
            
            {/* Android navigation bar */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/80 z-10 flex items-center justify-around">
              <div className="w-6 h-1 bg-white/50 rounded-full"></div>
              <div className="w-6 h-6 border-2 border-white/50 rounded-full"></div>
              <div className="w-6 h-6 border-2 border-white/50 rounded-sm"></div>
            </div>
          </div>
          
          {/* Side buttons */}
          <div className="absolute right-0 top-20 w-1 h-10 bg-gray-700 rounded-l"></div>
          <div className="absolute right-0 top-32 w-1 h-16 bg-gray-700 rounded-l"></div>
        </div>
      )}
    </div>
  );
};
