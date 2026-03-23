"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";

export function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide snap-x">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-[300px] md:w-[600px] aspect-[16/9] glass-apple rounded-[3rem] shrink-0 border-white/5 flex items-center justify-center italic text-white/5 font-bold uppercase tracking-widest text-lg">
             NOT_STAGED_0{i}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide snap-x no-scrollbar relative z-10">
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedImage(image)}
            className="w-[300px] md:w-[600px] aspect-[16/9] relative overflow-hidden rounded-[3rem] cursor-pointer shrink-0 glass-apple border-white/10 shadow-2xl transition-all duration-700 snap-center"
          >
            <img
              src={image}
              alt={`Screenshot ${index + 1}`}
              className="w-full h-full object-cover rounded-[2.8rem] group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors glass-apple p-4 rounded-full border-white/10"
              onClick={() => setSelectedImage(null)}
            >
              <XIcon size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative max-w-7xl max-h-[85vh] w-full rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged screenshot"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
