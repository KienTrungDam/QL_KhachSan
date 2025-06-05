export default function Course() {
  const courses = [
    {
        name: "java",
        price: "1000",
    },
    {
        name: "HTML",
        price: "500",
    },
    {
        name: "CSS",
        price: "700",
    },
  ]
    return (
        <div>
            <ul>
                {courses.map((course, index) => {
                    return (
                        <>
                            {course.price >= 700 ? (<li>name: {course.name} - {course.price}</li>) :
                                ("")
                            }
                        </>
                    )
                })}
        </ul>
        </div>
    );

}
