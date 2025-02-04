import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import './App.scss'
import remarkGfm from 'remark-gfm'
import { routers, raws } from './docs'
import { visit } from 'unist-util-visit'
import ReactMarkdown from 'react-markdown'
import Nav from '@/sites/doc/components/nav'
import remarkDirective from 'remark-directive'
import Header from '@/sites/doc/components/header'
import Demoblock from '@/sites/doc/components/demoblock'
import DemoPreview from '@/sites/doc/components/demo-preview'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

function myRemarkPlugin() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        if (node.name !== 'demo') return

        const data = node.data || (node.data = {})

        data.hName = 'div'
        data.hProperties = {
          class: 'nutui-react--demo-wrapper',
        }
      }
    })
  }
}

const App = () => {
  return (
    <div>
      <HashRouter>
        <Header></Header>
        <Nav></Nav>
        <div className="doc-content">
          <div className="doc-content-document">
            <Switch>
              {routers.map((ru, k) => {
                return (
                  <Route key={k} path={`/${ru}`}>
                    <ReactMarkdown
                      children={raws[ru]}
                      remarkPlugins={[remarkGfm, remarkDirective, myRemarkPlugin]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          console.log('props', node)
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <Demoblock text={String(children).replace(/\n$/, '')}>
                              <SyntaxHighlighter
                                children={String(children).replace(/\n$/, '')}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              />
                            </Demoblock>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        },
                      }}
                    />
                  </Route>
                )
              })}
            </Switch>
          </div>
          <div className="markdown-body">
            <DemoPreview></DemoPreview>
          </div>
        </div>
      </HashRouter>
    </div>
  )
}
export default App
