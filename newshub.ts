import axios, {type AxiosInstance, type AxiosResponse} from "axios"

export interface Link {
    id?: number
    url: string
    title: string
    description: string
    category: number
}

export interface Category {
    id: number
    name: string
}

export interface ApiResponse<T> {
    count: number
    next: string
    previous: string
    results: T[]
}

class NewsHubAPI {
    private client: AxiosInstance;

    constructor(apiUrl: string, apiToken: string) {
        this.client = axios.create({
            baseURL: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiToken}`
            }
        })
    }

    private async request(endpoint: string, method: string = "get", data: object = null) {
        const response: AxiosResponse = await this.client.request({
            url: endpoint,
            method: method,
            data: data
        })
        return response.data;

    }

    async getCategories(): Promise<Array<Category>> {
        const resp: ApiResponse<Category> = await this.request("/categories/")
        if (resp.next !== null) {
            const newPage = await this.request(resp.next)
            return resp.results.concat(newPage.results)
        }
        return resp.results
    }

    async submitLink(link: Link): Promise<Link> {
        return this.request("/links/", "post", link)
    }
}

export default NewsHubAPI;
