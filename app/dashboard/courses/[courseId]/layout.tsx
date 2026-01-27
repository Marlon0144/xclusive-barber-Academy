import CourseSidebar from '@/components/courses/CourseSidebar'

// En Next.js 15, params en layout también es una Promesa
interface CourseLayoutProps {
  children: React.ReactNode
  params: Promise<{
    courseId: string
  }>
}

export default async function CourseLayout({ children, params }: CourseLayoutProps) {
  // Desempaquetamos el ID del módulo (courseId en la URL)
  const { courseId } = await params

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* SIDEBAR:
        En móvil (hidden md:block) podríamos ocultarlo o hacerlo un menú hamburguesa luego.
        Por ahora lo mostramos simple a la izquierda en desktop.
      */}
      <aside className="hidden md:block w-80 flex-shrink-0 h-[calc(100vh-64px)] sticky top-16">
         {/* Pasamos el ID para que busque las lecciones de ESTE módulo */}
        <CourseSidebar moduleId={courseId} />
      </aside>

      {/* CONTENIDO PRINCIPAL (Aquí se renderiza el page.tsx del video) */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}