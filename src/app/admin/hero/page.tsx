"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHeroSlides } from "@/lib/api";
import api from "@/lib/api";
import { toast } from "sonner";
import { HeroSlideModal } from "@/components/admin/HeroSlideModal";

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<any>(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await getHeroSlides();
      setSlides(data);
    } catch (error) {
      toast.error("Failed to fetch slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      await api.delete(`/heroslides/${id}/`);
      toast.success("Slide deleted successfully");
      fetchSlides();
    } catch (error) {
      toast.error("Failed to delete slide");
    }
  };

  const handleEdit = (slide: any) => {
    setSelectedSlide(slide);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedSlide(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 font-heading">
            Hero Slides
          </h1>
          <p className="text-[13px] md:text-[14px] text-gray-500 font-medium max-w-md">
            Manage your homepage carousel slides. You can edit images, text, and button links here.
          </p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-[#006837] hover:bg-black text-white px-8 py-4 md:py-6 rounded-2xl md:rounded-full font-bold shadow-xl shadow-[#006837]/20 transition-all flex items-center justify-center gap-2 group w-full md:w-auto"
        >
          <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform">
            <Plus className="h-4 w-4" />
          </div>
          Add New Slide
        </Button>
      </div>


      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : slides.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No slides found</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto font-medium">Create your first hero slide to start showcasing your products.</p>
            <Button onClick={handleAdd} className="rounded-full px-8 bg-[#006837] hover:bg-black font-bold">
              Create First Slide
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {slides.map((slide) => (
              <div 
                key={slide.id} 
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-[#006837]/5 transition-all duration-500 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={slide.image_url} 
                    alt={slide.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {slide.is_active ? (
                      <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-lg">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="bg-gray-500/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-lg">
                        <XCircle size={12} /> Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 font-heading leading-tight">{slide.title}</h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 flex-1">{slide.subtitle}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(slide)}
                        className="w-11 h-11 rounded-2xl hover:bg-[#006837]/10 hover:text-[#006837] text-gray-400 transition-all"
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(slide.id)}
                        className="w-11 h-11 rounded-2xl hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <HeroSlideModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slide={selectedSlide}
        onSuccess={fetchSlides}
      />
    </div>
  );
}
