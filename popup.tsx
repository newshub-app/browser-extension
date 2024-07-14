import {useEffect, useState} from "react"
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import {sendToContentScript} from "~node_modules/@plasmohq/messaging";

import "bootstrap/dist/css/bootstrap.css"

function IndexPopup() {
    const [pageUrl, setPageUrl] = useState<string>("no-url")
    const [pageTitle, setPageTitle] = useState<string>("no-title")
    const [pageDesc, setPageDesc] = useState<string>("no-desc")

    useEffect(() => {
        console.log("requesting page info from content script")
        sendToContentScript({name: "pageinfo"}
        ).then(resp => {
                console.log("page info received")
                console.log(resp)
                setPageUrl(resp.url)
                setPageTitle(resp.title)
                setPageDesc(resp.description)
            }
        ).catch(err => {
            console.error("error getting page info:", err)
        })
    }, [])

    return (
        <Container style={{padding: 10}}>
            <Form>
                <label htmlFor="#urlfield">URL</label>
                <input id={"urlField"} onChange={(e) => setPageUrl(e.target.value)} value={pageUrl}/>
                <label htmlFor="#titleField">Title</label>
                <input id={"titleField"} onChange={(e) => setPageTitle(e.target.value)} value={pageTitle}/>
                <label htmlFor="#descField">Description</label>
                <input id={"descField"} onChange={(e) => setPageDesc(e.target.value)} value={pageDesc}/>
                <Button type={"submit"} style={{marginTop: 5}}>Save to NewsHub</Button>
            </Form>
        </Container>
    )
}

export default IndexPopup
