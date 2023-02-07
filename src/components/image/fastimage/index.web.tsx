import React, { useState } from "react";
import { Image } from "react-native";
import { FastImageProps,FastImageStaticProperties, Source } from "react-native-fast-image";
import {Dimensions, StyleSheet, TouchableHighlight, View, Text} from 'react-native';
import styled from 'styled-components/native'
import { LazyLoadImage } from "react-lazy-load-image-component";



const FastImage  = (props: FastImageProps) => {

    //const [imgSrc, setSrc] = useState(props.source.uri);

    const urlImage = (props.source as Source).uri;
    console.log(`FastWebImage: [${urlImage}]`);

    const _onError = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
        console.log(`FastWebImage: [${urlImage}] ERROR`);
        if(!!props.onError){
            props.onError();
        }
    }

    return(
        <LazyLoadImage style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            objectFit: props.resizeMode ??'cover',
            WebkitUserSelect: 'none',
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            OUserSelect: 'none',
            userSelect: 'none',
            WebkitUserDrag:'none',
            userDrag: 'none',
            WebkitTouchCallout:'none',
            onerror:_onError,
            onabort:_onError
        }} src={urlImage} />        
    )
}


export default FastImage;