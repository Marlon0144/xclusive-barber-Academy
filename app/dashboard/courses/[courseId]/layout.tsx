// En Next.js 15, params en layout también es una Promesa
interface CourseLayoutProps {
  children: React.ReactNode
}

export default async function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SIDEBAR REMOVED FOR FIGMA DESIGN COMPLIANCE (Full Screen Lesson View) 
          Original code commented out for reference:
      <aside className="hidden md:block w-80 flex-shrink-0 h-[calc(100vh-64px)] sticky top-16">
        <CourseSidebar moduleId={courseId} />
      </aside>
      */}

      {/* CONTENIDO PRINCIPAL (Aquí se renderiza el page.tsx del video) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}