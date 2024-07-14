import {useMessage} from "@plasmohq/messaging/dist/hook"

const UNKNOWN = "unknown"

interface PageInfo {
    title: string,
    url: string,
    description?: string
}

const ContentScriptHandler = () => {
    useMessage<string, PageInfo>(async (req, res) => {
        if (req.name === "pageinfo") {
            const title = document.title ?? UNKNOWN
            const url = window.location.href ?? UNKNOWN
            const description = document.querySelector("meta[name='description']")?.getAttribute("content") ?? UNKNOWN
            res.send({title: title, url: url, description: description})
        }
    })
}

export default ContentScriptHandler
