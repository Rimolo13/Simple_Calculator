unit main;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, StdCtrls, fpexprpars;

type

  { TForm1 }

  TForm1 = class(TForm)
    Button1: TButton;
    Button2: TButton;
    Button3: TButton;
    Button4: TButton;
    Button5: TButton;
    Button6: TButton;
    Button7: TButton;
    Button8: TButton;
    Button9: TButton;
    Button10: TButton;
    Button11: TButton;
    Button12: TButton;
    Button13: TButton;
    Button14: TButton;
    Button15: TButton;
    Button16: TButton;
    Button17: TButton;
    Button18: TButton;
    Button19: TButton;
    Button20: TButton;
    Button21: TButton;
    Button22: TButton;
    Button23: TButton;
    Button24: TButton;
    Label1: TLabel;
    procedure AddSymbol(Sender: TObject);
    procedure AddOperation(Sender: TObject);
    procedure RemoveLastSymbol(Sender: TObject);
    procedure Clear(Sender: TObject);
    procedure StartCalc(Sender: TObject);
  end;

var
  Form1: TForm1;



implementation

{$R *.lfm}

{ TForm1 }

{ my eval alternative }
function calc(input: string): string;
var
  Parser: TFPExpressionParser;
  output: TFPExpressionResult;

begin
  Parser := TFPExpressionParser.Create(nil);

  try
    try
      Parser.Expression := input;
      output := Parser.Evaluate;

      case output.ResultType of
        rtInteger:
          Result := IntToStr(output.ResInteger);

        rtFloat:
          Result := FloatToStr(output.ResFloat);
      end;
    except
      Result := 'Error by Input!';
    end;
  finally
    Parser.Free;
  end;
end;

function Replace(input: string; mode: integer): string;
var
  FilterA:  array of string;
  FilterE: array of string;
  i: Integer;

begin
  FilterA := [',','%','π'];
  FilterE := ['.','/100','3.14159'];

  if mode = 0 then
    for i := Low(FilterA) to High(FilterA) do
      input := StringReplace(input, FilterA[i], FilterE[i], [rfReplaceAll])
  else
    input := StringReplace(input, FilterE[0], FilterA[0], [rfReplaceAll]);
  Result := input;
end;

procedure TForm1.AddSymbol(Sender: TObject);
begin
  Label1.Caption := Label1.Caption + (Sender as TButton).Caption;
end;

procedure TForm1.AddOperation(Sender: TObject);
begin
  Label1.Caption := Label1.Caption + ' ' + (Sender as TButton).Caption + ' ';
end;

procedure TForm1.RemoveLastSymbol(Sender: TObject);
begin
  if Length(Label1.Caption) > 0 then
     Label1.Caption := Copy(Label1.Caption, 1, Length(Label1.Caption) - 1);
end;

procedure TForm1.Clear(Sender: TObject);
begin
  Label1.Caption := '';
end;

procedure TForm1.StartCalc(Sender: TObject);
var
  calculation: string;
begin
   calculation := Copy(Label1.Caption, 1, Length(Label1.Caption));
   calculation := Replace(calculation,0);
   Label1.caption := Replace(calc(calculation),1);
end;

end.
