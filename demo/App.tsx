import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import { DemoPlayground } from './DemoPlayground'
import { demoScripts } from './demoScripts'

export function App(): JSX.Element {
  const allMethods = Object.keys(demoScripts).sort()

  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/demo/${allMethods[0]}`}></Redirect>
        </Route>
        {allMethods.map((apiName: string) => {
          return (
            <Route
              key={apiName}
              path={`/demo/:apiName(${apiName})`}
              component={DemoPlayground}
            ></Route>
          )
        })}
      </Switch>
    </HashRouter>
  )
}
