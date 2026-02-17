import { View, TextInput, Text, TextInputProps } from "react-native";

interface Props extends TextInputProps {
    label: string;
}

export default function InputField({ label, ...props }: Props) {
    return (
        <View className="w-full my-3">
            {label ? <Text className="text-police-navy font-black text-[10px] uppercase tracking-[2px] mb-2 ml-4">{label}</Text> : null}
            <TextInput
                className={`w-full bg-gray-50/50 border border-gray-100 rounded-[20px] px-6 py-4 text-police-dark font-semibold shadow-inner ${props.multiline ? 'h-32 pt-5' : ''}`}
                {...props}
                placeholderTextColor="#CBD5E1"
                selectionColor="#D4AF37"
                textAlignVertical={props.multiline ? 'top' : 'center'}
            />

        </View>
    );
}
