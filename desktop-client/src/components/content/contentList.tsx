import useContentStore, { ContentType } from "./store";
import WizformsList from "./wizforms/list";

function ContentList() {
    const contentType = useContentStore(state => state.currentType);

    // switch (contentType) {
    //     case ContentType.Wizforms:
    //         return <WizformsList/>
    //     case ContentType.Elements:
    //         return null;
    // }
}

export default ContentList;