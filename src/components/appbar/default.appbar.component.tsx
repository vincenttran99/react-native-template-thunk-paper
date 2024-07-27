import {Appbar} from 'react-native-paper';
import {getHeaderTitle} from '@react-navigation/elements';
import {NativeStackHeaderProps} from "@react-navigation/native-stack/src/types";

export default function DefaultAppbarComponent({ navigation, route, options, back }:NativeStackHeaderProps) {
    const title = getHeaderTitle(options, route.name);

    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
}