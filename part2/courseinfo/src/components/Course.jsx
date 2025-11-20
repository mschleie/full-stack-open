const Header = (props) => {
  // console.log(props)
  return (
    <div>
      <h2>{props.course}</h2>
    </div>
  )
}

const Content = (props) => {
  //console.log(props)
  return (
    <div>
      {props.parts.map(part => <Part key={part.id} part={part}/>)}
    </div>
  )
}

const Part = (props) => {
  //console.log(props)
  return (
    <div>
      <p>{props.part.name} {props.part.exercises}</p>
    </div>
  )
}

const Course = (props) => {
    //console.log(props)

    const total = props.course.parts.reduce((s, p) => s + p.exercises, 0)

    return (
        <div>
            <Header course={props.course.name}/>
            <Content parts={props.course.parts}/>
            <p><b>total of {total} exercises</b></p>
        </div>
    )
}

export default Course