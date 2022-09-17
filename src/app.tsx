import { FC, ReactElement } from 'react'
import './app.scss'

const App: FC<{ children: ReactElement }> = function (props) {
  return props.children
}

export default App
