import useContentStore, { ContentType } from "./store";
import WizformsCore from "./wizforms/core";

function ContentMain() {
    const contentType = useContentStore(state => state.currentType);
    return <div style={{width: '100%', height: '100%'}}>
        <ContentCore type={contentType}/>
    </div>
}

function ContentCore(params: {
    type: ContentType
}) {
    switch (params.type) {
        case ContentType.Wizforms:
            return <WizformsCore/>
        case ContentType.Elements:
            return null;
    }
}

export default ContentMain;